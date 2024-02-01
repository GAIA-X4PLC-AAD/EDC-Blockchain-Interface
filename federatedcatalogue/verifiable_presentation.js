import axios from "axios";
import fs from 'fs';


const getVerifiablePresentation = async (parameters) => {
    let response;
    const { surveyId, surveyDescription, surveyTitle, surveyUrl } = parameters;
    console.log("surveyId: %s surveyDescription: %s surveyTitle: %s surveyUrl: %s", surveyId, surveyDescription, surveyTitle, surveyUrl);
    try {
        // Read the template from a file
        const data = fs.readFileSync("./federatedcatalogue/vp_template.json");
        let jsonTemplate = JSON.parse(data);

        // Insert variables into the template
        jsonTemplate['surveyonto:survey_id']['@value'] = surveyId;
        jsonTemplate['surveyonto:survey_description']['@value'] = surveyDescription;
        jsonTemplate['surveyonto:survey_title']['@value'] = surveyTitle;
        jsonTemplate['surveyonto:survey_url']['@value'] = surveyUrl;
        jsonTemplate['@id'] = 'did:example:survey_service_offering_' + surveyId;

        // Sending the modified JSON to the endpoint
        const response = await axios.post('https://sd-creator.gxfs.gx4fm.org/self-description', jsonTemplate);
        
        // Saving the result as JSON in a variable
        const resultJson = response.data;

        console.log('Result: ', resultJson);
        
        // Send back the result to the client
        return resultJson;
    } catch (error) {
        console.log(error)
        return error
    }
    
    return response;
  };

  export { getVerifiablePresentation };