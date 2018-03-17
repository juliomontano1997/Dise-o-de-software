import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {
    private subject = new Subject<any>();

    //component that have a observer send message to notify all the observers
    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    //observers get the messsages that the observer component has sent
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}