import { User } from '@/services/users/user.interface';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent implements OnInit, OnDestroy {
  private subscribtions: Subscription[] = [];

  @Input({ required: true }) title!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) altLabel!: string;
  @Input({ required: true }) altLink!: string;
  @Input({ required: true }) error!: string | null;
  @Output() errorChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  @Output("submit") submitEmitter: EventEmitter<User> = new EventEmitter<User>();

  protected username = new FormControl<string>("");
  protected password = new FormControl<string>("");

  ngOnInit(): void {
    const logic = () => {
      this.error = null;
      this.errorChange.emit(null);
    }
    this.subscribtions.push(this.username.valueChanges.subscribe(logic));
    this.subscribtions.push(this.password.valueChanges.subscribe(logic));
  }

  ngOnDestroy(): void {
    this.subscribtions.forEach(x => x.unsubscribe());
  }

  onSubmit() {
    this.submitEmitter.emit({ username: this.username.value!, password: this.password.value! });
  }
}
