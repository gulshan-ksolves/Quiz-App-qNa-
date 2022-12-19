import { LightningElement, wire, track} from 'lwc';

import getQuestions from '@salesforce/apex/QuestionsController.getQuestions';
import getResult from '@salesforce/apex/QuestionsController.getResult';



export default class QNa extends LightningElement {
        questions
        isSubmitted= false
        CorrectAnswerCount=0;
        @track selectedAnswers=[];
        @track q1Id;
        @track q1Ans;
        @track q2Id;
        @track q2Ans;
        @track q3Id;
        @track q3Ans;
      

        get isScoredFull(){
            return `slds-text-heading_large ${this.questions.length === this.CorrectAnswerCount?
            'slds-text-color_success': 'slds-text-color_error'}`
        }

        radioHandler(event){
             console.log("answer value --",event.target.value);
             console.log("answer name --",event.target.name);
             console.log("answer name --",event.target.title);
             if(event.target.title == '0'){
                this.q1Id = event.target.name;
                this.q1Ans = event.target.value;
            }
            if(event.target.title == '1'){
                this.q2Id = event.target.name;
                this.q2Ans = event.target.value;
            }
            if(event.target.title == '2'){
                this.q3Id = event.target.name;
                this.q3Ans = event.target.value;
            }
        }


    @wire(getQuestions)
    questionsHandler({data, error}){
        if(data){
             console.log(data)
             this.questions = data
             console.log("questions--",this.questions);
        }
      
        if(error){
            this.error = error
            console.error(error)

        }
    }
    submitHandler(event){
        event.preventDefault()// using this it will not refreh the page.
        console.log("q1Id --",this.q1Id);
        console.log("q1Ans--",this.q1Ans);
        console.log("q2Id --",this.q2Id);
        console.log("q2Ans--",this.q2Ans);
        console.log("q3Id --",this.q3Id);
        console.log("q3Ans--",this.q3Ans);
        if(this.q1Id != 'undefined' && this.q1Id != undefined && this.q1Id !=''){
            this.selectedAnswers.push({Id: this.q1Id, Value: this.q1Ans});
        }
        if(this.q2Id != 'undefined'&&  this.q2Id != undefined &&  this.q2Id !=''){
            this.selectedAnswers.push({Id: this.q2Id, Value: this.q2Ans});
        }
        if(this.q3Id != 'undefined'&&  this.q3Id != undefined &&  this.q3Id !=''){
            this.selectedAnswers.push({Id: this.q3Id, Value: this.q3Ans});
        }
        let cont = JSON.stringify(this.selectedAnswers);
        console.log('secIndirectDateValue---',cont);
        getResult({answerList : cont})
            .then(result => {
                console.log('resultll INSERT--',result);
                this.CorrectAnswerCount = result;
                this.isSubmitted = true;
            })
            .catch(error => {
                window.console.log(' Error Occured on the page---', error)

            }) 

               console.log(JSON.parse(JSON.stringify(this.selected)))
    }

  
   
    resetHandler(){
        this.CorrectAnswerCount=0;
        this.selectedAnswers=[];
        this.isSubmitted = false;
        this.q1Id='';
        this.q1Ans='';
        this.q2Id='';
        this.q2Ans='';
        this.q2Id='';
        this.q2Ans='';
        }
    }
    

