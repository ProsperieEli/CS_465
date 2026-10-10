import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripData: TripData,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert('Could not find the selected trip code.');
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripData.getTrip(tripCode).subscribe({
      next: (value: Trip[]) => {
        if (!value || value.length === 0) {
          this.message = 'No trip retrieved!';
        } else {
          this.trip = value[0];

          this.editForm.patchValue({
            ...this.trip,
            start: this.trip.start
              ? String(this.trip.start).slice(0, 10)
              : '',
          });

          this.message = 'Trip: ' + tripCode + ' retrieved';
        }

        console.log(this.message);
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.log('Error:', error);
      },
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (!this.editForm.valid) {
      return;
    }

    this.tripData.updateTrip(this.editForm.value).subscribe({
      next: (value: any) => {
        console.log(value);
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.log('Error:', error);
      },
    });
  }

  get f() {
    return this.editForm.controls;
  }
}