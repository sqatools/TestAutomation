import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const baseURL = 'https://api.restful-api.dev';
const objectsPath = '/objects';

function createUniqueName(): string {
  return `playwright-public-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function createObject(api: APIRequestContext, name: string, data: unknown): Promise<string> {
  const response = await api.post(objectsPath, { data: { name, data } });
  expect(response.ok(), 'Test setup should create a public object').toBeTruthy();
  const created = await response.json();
  expect(created.id).toEqual(expect.any(String));
  return created.id;
}

async function deleteObjectIfPresent(api: APIRequestContext, id: string): Promise<void> {
  const response = await api.delete(`${objectsPath}/${id}`);
  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Failed to clean up public test object ${id}: HTTP ${response.status()}`);
  }
}

test.describe('Public API automation', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Public API checks run once to conserve the documented daily request quota');

  test('GET public object list without authentication', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    try {
      const response = await api.get(objectsPath);
      expect(response.ok(), 'The public list endpoint should work without credentials').toBeTruthy();
      const objects: Array<{ id: string; name: string; data: unknown }> = await response.json();
      expect(objects.length).toBeGreaterThan(0);
      for (const object of objects) {
        expect(object).toEqual(expect.objectContaining({ id: expect.any(String), name: expect.any(String) }));
        expect(object).toHaveProperty('data');
      }
      expect(objects.some(({ id }) => id === '7')).toBeTruthy();
    } finally {
      await api.dispose();
    }
  });

  test('GET public object list filtered by repeated IDs', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    try {
      const response = await api.get(`${objectsPath}?id=3&id=5&id=10`);
      expect(response.ok()).toBeTruthy();
      const objects: Array<{ id: string }> = await response.json();
      expect(objects.map(({ id }) => id).sort()).toEqual(['10', '3', '5']);

    } finally {
      await api.dispose();
    }
  });

  test('GET a public object by ID', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    try {
      const response = await api.get(`${objectsPath}/7`);
      expect(response.ok()).toBeTruthy();
      expect(await response.json()).toEqual(expect.objectContaining({
        id: '7',
        name: 'Apple MacBook Pro 16',
        data: expect.objectContaining({ year: 2019 }),
      }));
    } finally {
      await api.dispose();
    }
  });

  test('GET an unknown public object returns an error', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    try {
      const response = await api.get(`${objectsPath}/987654321`);
      expect(response.ok(), 'An unknown public object must not return success').toBeFalsy();
      expect(await response.json()).toHaveProperty('error');
    } finally {
      await api.dispose();
    }
  });

  test('POST creates a public object with flexible JSON data', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    let id: string | undefined;
    const name = createUniqueName();
    const data = { nested: { enabled: true, values: [1, 'two'] }, price: 42.5 };
    try {
      const response = await api.post(objectsPath, { data: { name, data } });
      expect(response.ok()).toBeTruthy();
      const created = await response.json();
      expect(created).toEqual(expect.objectContaining({ name, data }));
      expect(created.id).toEqual(expect.any(String));
      id = created.id;

      const readResponse = await api.get(`${objectsPath}/${id}`);
      expect(readResponse.ok()).toBeTruthy();
      expect(await readResponse.json()).toEqual(expect.objectContaining({ id, name, data }));
    } finally {
      try {
        if (id) await deleteObjectIfPresent(api, id);
      } finally {
        await api.dispose();
      }
    }
  });

  test('PUT fully replaces a public object', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    let id: string | undefined;
    const name = createUniqueName();
    try {
      id = await createObject(api, name, { oldField: 'remove me', nested: { retained: false } });
      const replacement = { name: `${name}-replaced`, data: { newField: 'replacement' } };
      const updateResponse = await api.put(`${objectsPath}/${id}`, { data: replacement });
      expect(updateResponse.ok()).toBeTruthy();
      expect(await updateResponse.json()).toEqual(expect.objectContaining(replacement));

      const readResponse = await api.get(`${objectsPath}/${id}`);
      expect(readResponse.ok()).toBeTruthy();
      const updated = await readResponse.json();
      expect(updated.name).toBe(replacement.name);
      expect(updated.data).toEqual(replacement.data);
    } finally {
      try {
        if (id) await deleteObjectIfPresent(api, id);
      } finally {
        await api.dispose();
      }
    }
  });

  test('PATCH partially updates a public object', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    let id: string | undefined;
    const name = createUniqueName();
    const originalData = { nested: { retained: true }, value: 17 };
    try {
      id = await createObject(api, name, originalData);
      const patchedName = `${name}-patched`;
      const patchResponse = await api.patch(`${objectsPath}/${id}`, { data: { name: patchedName } });
      expect(patchResponse.ok()).toBeTruthy();
      expect(await patchResponse.json()).toEqual(expect.objectContaining({ id, name: patchedName, data: originalData }));

      const readResponse = await api.get(`${objectsPath}/${id}`);
      expect(readResponse.ok()).toBeTruthy();
      expect(await readResponse.json()).toEqual(expect.objectContaining({ id, name: patchedName, data: originalData }));
    } finally {
      try {
        if (id) await deleteObjectIfPresent(api, id);
      } finally {
        await api.dispose();
      }
    }
  });

  test('DELETE removes a public object', { tag: '@API' }, async () => {
    const api = await request.newContext({ baseURL });
    let id: string | undefined;
    try {
      id = await createObject(api, createUniqueName(), { cleanup: true });
      const deleteResponse = await api.delete(`${objectsPath}/${id}`);
      expect(deleteResponse.ok()).toBeTruthy();
      expect(await deleteResponse.json()).toHaveProperty('message');

      const deletedObjectId = id;
      id = undefined;
      const readResponse = await api.get(`${objectsPath}/${deletedObjectId}`);
      expect(readResponse.ok(), 'A deleted object must not be retrievable').toBeFalsy();
      expect(await readResponse.json()).toHaveProperty('error');
    } finally {
      try {
        if (id) await deleteObjectIfPresent(api, id);
      } finally {
        await api.dispose();
      }
    }
  });
});
