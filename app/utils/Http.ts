import * as http from 'http';
import axios from 'axios';

export default class HttpClient {

    constructor(private baseUrl:string){
    }

    async getRandonQuestions(){
        const { data } = await axios.get(`${this.baseUrl}`);
        return data.results;
    }
}
