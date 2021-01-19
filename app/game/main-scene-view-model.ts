import { ListView, Observable, ObservableArray, Page, Repeater } from "@nativescript/core";
import { setInterval, clearInterval} from "@nativescript/core/timer";
import HttpClient from "~/utils/Http"
import { keyBy, unescape, union, sortBy } from 'lodash';

export class MainSceneViewModel extends Observable {

    user_name: string;
    isGameStarted: boolean;
    time: number;
    isTimeVisible: boolean;

    questions: { [key:string]: any};
    questionCount: number=0;
    answers: ObservableArray<string>;

    constructor(name:string, private http:HttpClient, private pageRef:Page) {
        super();
        this.user_name = name;
        this.time=5;
        this.isTimeVisible = false;
        this.questions = {};
    }

    async startGame(){
        this.loadQuestions();
        this.set('isTimeVisible',true);
        let interval = setInterval(()=>{
            this.set('time', this.time -1);
            if(this.time === 0){
                this.set('isTimeVisible',false);
                this.set('isGameStarted',true);
                clearInterval(interval);
            }
        },1000);
    }

    async loadQuestions(){
        const questions = await this.http.getRandonQuestions();
        for(var i=0; i< questions.length; i+=1){
            questions[i].index = i;
            questions[i].question = unescape(questions[i].question.replace('&#',' &#'));
            questions[i].answers = union(questions[i].incorrect_answers.map((a,i)=>unescape(a)),[questions[i].correct_answer]).sort();
        }
        this.set('questions',keyBy(questions,'index'));
        this.questions[this.questionCount].answers.forEach(i=>this.answers.push(i))
    }


    answer(option: number){

    }

}
