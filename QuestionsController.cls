public with sharing class QuestionsController {
    @AuraEnabled(Cacheable=true)
    public static List<Questions__c> getQuestions(){
        List<Questions__c> randomlist = new List<Questions__c>();
        List<Questions__c> initiallist = new List<Questions__c>();
        initiallist = [SELECT Id, Name, Option1__c, Option2__c, Option3__c FROM Questions__c];
        
        Questions__c ques;
        integer randomIndex;
        integer currentIndex = initiallist.size();
        
         while (currentIndex != 0) {
              randomIndex = integer.valueOf(Math.floor(Math.random() * currentIndex));
              currentIndex -= 1;
              ques = initiallist[currentIndex];
              initiallist[currentIndex] = initiallist[randomIndex];
              initiallist[randomIndex] = ques;
          }
        
        for(integer i=0;i<3;i++){
            randomlist.add(initiallist[i]);
                 }
       
         return randomlist;
        
    }
    
    @AuraEnabled 
    public static  Integer getResult (String answerList){
        List<object> ordItemDataList =   (List<object>)JSON.deserializeUntyped(answerList);
        Map<String,String> anslist = new Map<String,String>();
        List<Results__c> resultUpdate = new  List<Results__c>();
        integer countAns= 0;

        for(Object obj : ordItemDataList)
        {
                Map<String, Object> data = (Map<String, Object>)obj;
                String Id = (String)data.get('Id');
                String ans = (String)data.get('Value');
                anslist.put(Id,ans);            
        }

        for(Questions__c q:[SELECT Id, Name, Option1__c, Option2__c, Option3__c,Answer__r.Name,(SELECT Id, Name, No_of_Times_Answered__c, 
        Question__c, No_of_Times_Correctly_Answered__c, No_of_Times_Wrongly_Answered__c FROM Results__r) FROM Questions__c WHERE Id =:anslist.keySet()]){
            System.debug('q--'+q);

            if(anslist.containsKey(q.Id)) {
                Results__c re = new Results__c();
                for(Results__c res : q.Results__r){
                    re.Id = res.Id;
                    re.No_of_Times_Answered__c = res.No_of_Times_Answered__c+1;
                    if(q.Answer__r.Name ==  anslist.get(q.Id)){
                        countAns++;
                        re.No_of_Times_Correctly_Answered__c = res.No_of_Times_Correctly_Answered__c+1;
                    }else if(q.Answer__r.Name !=  anslist.get(q.Id)){
                        re.No_of_Times_Wrongly_Answered__c = res.No_of_Times_Wrongly_Answered__c+1;
                    }
                    System.debug('re--'+re);
                    resultUpdate.add(re);
                }
                
                
            }
        }

        if(!resultUpdate.isEmpty()){
            update resultUpdate;
        }
        System.debug('countAns--'+countAns);
        return countAns;
    }
}

