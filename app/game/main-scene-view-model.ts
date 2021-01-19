import { Observable } from "@nativescript/core";
import { setInterval, clearInterval} from "@nativescript/core/timer";
import HttpClient from "~/utils/Http"

export class MainSceneViewModel extends Observable {

    user_name: string;
    isGameStarted: boolean;
    time: number;
    isTimeVisible: boolean;

    constructor(name:string, private http:HttpClient) {
        super();
        this.user_name = name;
        this.time=5;
        this.isTimeVisible = false;
    }

    async startGame(){
        this.set('isTimeVisible',true);
        let interval = setInterval(()=>{
            this.set('time', this.time -1);
            if(this.time === 0){
                this.set('isTimeVisible',false);
                this.set('isGameStarted',true);
                this.loadQuestions();
                clearInterval(interval);
            }
        },1000);
    }

    async loadQuestions(){
        const questions = await this.http.getRandonQuestions();
        console.log(questions);
    }

}
