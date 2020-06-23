import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState, FormFieldTypes } from '@aws-amplify/ui-components';

import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  todos: Array<any>;
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  formFields: FormFieldTypes;

  constructor(private apiService: APIService, private ref: ChangeDetectorRef) {
    this.formFields = [
      {
        type: 'email',
        label: 'Custom email label',
        placeholder: 'Custom email placeholder',
        required: true
      },
      {
        type: 'password',
        label: 'Custom password label',
        placeholder: 'Custom password placeholder',
        required: true
      },
      {
        type: 'phone_number',
        label: 'Custom phone label',
        placeholder: 'Custom phone placeholder',
        required: false
      }
    ];
  }

  async ngOnInit() {

    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    });

    this.apiService.ListTodos().then((evt) => {
      this.todos = evt.items;
    });

    this.apiService.OnCreateTodoListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateTodo;
      this.todos = [...this.todos, data];
    });
  }

  createTodo() {
    this.apiService.CreateTodo({
      name: 'Angular',
      description: 'testing'
    });
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }

}
