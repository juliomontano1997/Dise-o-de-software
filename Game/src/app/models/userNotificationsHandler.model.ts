import {BehaviorSubject} from 'rxjs/BehaviorSubject';

declare const swal:any;

export class userNotificationsHandler {


    constructor(){
       
    }

    /**
     * 
     * @param notificationCode id to know if it's ncessary th show a success, danger or normal message
     */
    public notify(notificationCode:Number,message:String,notificationTitle:String){
        //success
        if (notificationCode===0){
            swal({
                type:'success',
                title: notificationTitle,
                text: message,
                confirmButtonColor: '#049F0C',
                confirmButtonText: 'Ok',
                
                });
        }
        //danger
        else if (notificationCode===1){
            swal({
                type:'error',
                title: notificationTitle,
                text: message,
                confirmButtonColor: '#049F0C',
                confirmButtonText: 'Ok',
                });
        }
        else if (notificationCode===2){
            swal({
                type:'success',
                title: notificationTitle,
                text: message,
                confirmButton:false                
                });
        }

        else{
            swal({
                type:'success',
                title: notificationTitle,
                text: message,
                timer: 5000,
                showConfirmButton: false
                
                });
        }
    }


}