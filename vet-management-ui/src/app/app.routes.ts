import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { OwnerList } from './owners/owner-list/owner-list';
import { PetList } from './pets/pet-list/pet-list';
import { PetForm } from './pets/pet-form/pet-form';
import { OwnerForm } from './owners/owner-form/owner-form';
import { OwnerDetails } from './owners/owner-details/owner-details';
import { AppointmentList } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';
import { AppointmentDetails } from './appointments/appointment-details/appointment-details';
import { PetDetails } from './pets/pet-details/pet-details';
import { MedicalRecordList } from './medical-records/medical-record-list/medical-record-list';
import { MedicalRecordForm } from './medical-records/medical-record-form/medical-record-form';
import { MedicalRecordDetails } from './medical-records/medical-record-details/medical-record-details';
import { Layout } from './layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                redirectTo: 'pets',
                pathMatch: 'full'
            },
            {
                path: 'owners',
                component: OwnerList
            },
            {
                path: 'create-owner',
                component: OwnerForm
            },
            {
                path: 'owners/details/:id',
                component: OwnerDetails
            },
            {
                path: 'owners/edit/:id',
                component: OwnerForm
            },
            {
                path: 'pets',
                component: PetList
            },
            {
                path: 'create-pet',
                component: PetForm
            },
            {
                path: 'pets/edit/:id',
                component: PetForm
            },
            {
                path: 'pets/details/:id',
                component: PetDetails
            },
            {
                path: 'appointments',
                component: AppointmentList
            },
            {
                path: 'create-appointment',
                component: AppointmentForm
            },
            {
                path: 'appointments/edit/:id',
                component: AppointmentForm
            },
            {
                path: 'appointments/details/:id',
                component: AppointmentDetails
            },
            {
                path: 'medical-records',
                component: MedicalRecordList
            },
            {
                path: 'create-medical-record',
                component: MedicalRecordForm
            },
            {
                path: 'medical-records/edit/:id',
                component: MedicalRecordForm
            },
            {
                path: 'medical-records/details/:id',
                component: MedicalRecordDetails
            }
        ]
    },
    {
        path: 'login',
        component: Login
    }
];
