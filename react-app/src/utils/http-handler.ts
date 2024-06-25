import axios from "axios";



//Function to handle the HTTP requests with RECAP external API
export const httpHandler = async (action: string, body?: any) => {
    if (typeof action !== "string") {

        console.log("ERROR", `[[HTTPREQ_RECAP_ERROR] ]Wrong parameters at HTTP request, url:${action}`)

    }
    try {
        if(body && action === 'move'){
            return axios({
                method:"post",
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:5000/${action}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: body,
                responseType: 'json',
            }).then((response) => {return response});

        }else if (action === 'status' && body){

            return axios({
                method:"get",
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:5000/${action}?matchId=${body['matchId']}`,
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: 'json',
            }).then((response) => {return response});

        }else{
            return axios({
                method:"post",
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:5000/${action}`,
                responseType: 'json',
            }).then((response) => {return response});

    
        }

    } catch (err: any) {
        console.error(err);
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {

            console.log("ERROR", `[HTTPREQ_ERROR] Error at ${action} RESPONSE`, err.response.status, err.response.data);

            let error = new Error("Wrong parameters at request");
            throw error;

        } else if (err.response) {

            console.log("ERROR", `[HTTPREQ_ERROR] Error at ${action} RESPONSE`, err.response.status, err.response.data);

        } else if (err.request) {

            console.log("ERROR", `[HTTPREQ_ERROR] Error at ${action} REQUEST`, 400, err);

        } else {

            console.log("ERROR", `[HTTPREQ_ERROR] Error at ${action} `, "", err);

        }

        let e = new Error('Error at HTTP-handler');

        throw e;
    }
};

