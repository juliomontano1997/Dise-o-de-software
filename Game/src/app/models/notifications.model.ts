

export class Notifications {

    private notificationId;
    private content:Array<any>; 
    
    constructor(notificationId:Number,content:String){
        this.notificationId=notificationId;
        this.content=content.split("\n");
        console.log("****************************** Contenido ***************************");
        
        console.log(content);
        console.log("****************************** Split ***************************");
        console.log(this.content);

        
    }

    public getNotificationId(): Number{
        return this.notificationId;
    }

    public getContentSize():Number{
        return this.content.length;
    }

    public getContent():Array<any>{
        return this.content;
    }



}