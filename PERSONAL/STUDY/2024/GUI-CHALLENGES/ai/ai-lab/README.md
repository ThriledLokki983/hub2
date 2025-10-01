# ai-lab

## NextGen Cloud (NGC)

NextGen Cloud provides a service that simplifies access and monitoring for using [GenAI services within PwC](https://ngcplatformtools.pwcinternal.com/wiki/docs/genai/shared_overview/). This is also where we can learn how to retrieve the API_KEY for OpenAI services.

One prerequisite for using this service is having an application (team) within the [Global Integration Fabric](https://gif.pwc.com/my-apps) (GIF). This is already enabled for the Experience Consulting team. This registration allows PwC to monitor usage of the API for our team. Therefore be mindful while using this API and do not attach it to automated queries (which may cause very high costs).

### Retrieving the API_KEY for OpenAI services

1. Within GIF, click on the application and then the environment to land on the details page.
2. On the left tab, select Subscriptions and then My Subscriptions.
3. On the list, you'll see a key icon toward the right. Click on it to copy the API_KEY.
4. Add this API key to your .env variables.

### Testing the connection with Postman

NGC provides a [Postman collection](https://ngcplatformtools.pwcinternal.com/wiki/docs/genai/api_guide/api_auth_setup/postman/) for testing out and trying the service with API calls. Download these and follow the steps found in the link to set it up.

### Getting the SDK for GenAI services

NGC also provides an [SDK](https://ngcplatformtools.pwcinternal.com/wiki/docs/genai/SDK/readme/) to support GenAI application development. Navigate to the link and follow the steps to set it up.

Once it is set up, you can create a new application with [Azure OpenAI services](https://ngcplatformtools.pwcinternal.com/wiki/docs/genai/SDK/readme-azure/).
