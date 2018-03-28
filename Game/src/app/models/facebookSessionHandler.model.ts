import {BehaviorSubject} from 'rxjs/BehaviorSubject';

declare const FB:any;

export class facebookSessionHandler {

    private appId: String;

    constructor(aplicationId:String){
        this.appId=aplicationId;
        this.init();
    }

    public getFB():any{
        return FB;
    }

    init() {
        let js,
          id = 'facebook-jssdk',
          ref = document.getElementsByTagName('script')[0];
    
        if (document.getElementById(id)) {
          return;
        }
    
        js = document.createElement('script');
        js.id = id;
        js.async = true;
        js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.12';
    
        ref.parentNode.insertBefore(js, ref);
    
        js.onload = results => {
          this.initSDK()
        }
      }
    
      initSDK() {
        FB.init({
          appId:this.appId,
          xfbml: true,
          version: 'v2.10'
        })

      }

      public logOut(){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                FB.logout(function(response) {
                    window.location.href='/'; //go to login page
                    });
                }
            });
            
        }
}