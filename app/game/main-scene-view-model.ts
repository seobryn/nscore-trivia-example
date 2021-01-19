import {  Frame, Observable, Page, PropertyChangeData } from "@nativescript/core";
import { setInterval, clearInterval} from "@nativescript/core/timer";
import HttpClient from "~/utils/Http"
import { keyBy, unescape, union } from 'lodash';
import { ObservableProperty } from "~/observable-property-decorator";
import { RadListView } from "nativescript-ui-listview";
import { ToastDuration, Toasty } from "nativescript-toasty";

declare const android;
declare const java;
export class MainSceneViewModel extends Observable {

    user_name: string;
    isGameStarted: boolean;
    time: number;
    isTimeVisible: boolean;
    tries= 3;
    correctAnswers: number=0;

    questions: { [key:string]: any};
    questionCount: number=0;
    letters: ['A','B','C','D'];
    @ObservableProperty() answers: string[];

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
        console.log(new java.lang.String(android.util.Base64.decode(questions[0].correct_answer, android.util.Base64.DEFAULT),java.nio.charset.StandardCharsets.UTF_8));

        this.answers = [];
        for(var i=0; i< questions.length; i+=1){
            questions[i].index = i;
            questions[i].question = new java.lang.String(android.util.Base64.decode(questions[i].question, android.util.Base64.DEFAULT),java.nio.charset.StandardCharsets.UTF_8);
            let index = Math.ceil(((Math.random()*100)+1) % questions[i].incorrect_answers.length);
            questions[i].answers = questions[i].incorrect_answers.map((a,i)=>new java.lang.String(android.util.Base64.decode(a, android.util.Base64.DEFAULT)));
            questions[i].answers.splice(index,0,new java.lang.String(android.util.Base64.decode(questions[i].correct_answer, android.util.Base64.DEFAULT)));
            questions[i].correct_answer = new java.lang.String(android.util.Base64.decode(questions[i].correct_answer, android.util.Base64.DEFAULT));
        }
        this.set('questions',keyBy(questions,'index'));
        this.answers = questions[this.questionCount].answers;
    }


    answer(response){
        if(this.answers[response.index] === this.questions[this.questionCount].correct_answer){
            new Toasty({
                text:'Correcto!',
                backgroundColor:"green",
                duration: ToastDuration.SHORT
            }).show();
            this.set('correctAnswers',this.correctAnswers+1);
        }else {
            new Toasty({
                text:'Incorrecto :(',
                backgroundColor:"red",
                duration: ToastDuration.SHORT
            }).show();
            this.set('tries',this.tries-1);
        }
        this.set('questionCount', this.questionCount+1);
        this.answers = this.questions[this.questionCount].answers;
        if(this.tries === 0 ){
            new Toasty({
                text: `Juego terminado, Puntaje: ${this.correctAnswers}`,
                backgroundColor:'blue',
                duration: ToastDuration.LONG,
            }).show()
            Frame.topmost().navigate({
                animated:true,
                moduleName: 'home/home-page',
            });
        }
    }

}
