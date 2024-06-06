import axios from "axios";
import fs from 'fs';
import { trace, context, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { contractConfig } from "../contractConfig.js";

const tracer = trace.getTracer('default');

const getVerifiablePresentation = async (parameters) => {
    let response;
    const { assetId, assetDescription, assetTitle, assetUrl } = parameters;
    console.log("assetId: %s assetDescription: %s assetTitle: %s assetUrl: %s", assetId, assetDescription, assetTitle, assetUrl);
    try {
        // Read the template from a file
        const data = fs.readFileSync("./federatedcatalogue/vp_template.json");
        let jsonTemplate = JSON.parse(data);

        console.log('Template: ', jsonTemplate )

        // Insert variables into the template
        jsonTemplate['assetonto:asset_id']['@value'] = assetId;
        jsonTemplate['assetonto:asset_description']['@value'] = assetDescription;
        jsonTemplate['assetonto:asset_title']['@value'] = assetTitle;
        jsonTemplate['assetonto:asset_url']['@value'] = assetUrl;
        jsonTemplate['@id'] = 'did:example:survey_service_offering_' + assetId;

        const response = await tracer.startActiveSpan('get VP from sd-creator', async (span) => {
            try {
                // Sending the modified JSON to the endpoint
                const response = await axios.post(`https://${contractConfig.sdCreatorURL}`, jsonTemplate);
                span.end();
                return response;
            } catch (error) {
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message,
                });
                console.error(error);
                span.end();
                throw error;
            }
            span.end();
        });
        
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