import {test, expect} from '@playwright/test';
import {APIRequestContext, request} from '@playwright/test';

test.describe('Go Rest API automation with AuthKey', () => { 
    test("@gorest read all users details", async ({request}) => {
        const response = await request.get(`${process.env.GOREST_BASE_URL!}/users`, {
            data: {},
            headers: {
                'Authorization': `Bearer ${process.env.BEARER_TOKEN!}`
            }
        });
        expect(response.ok()).toBeTruthy();
        const users = await response.json();
        console.log(users);
        expect(users.length).toBeGreaterThan(0);
    });


});