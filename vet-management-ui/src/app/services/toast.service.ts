import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Toast{
  id?: number;
  message: string;
  type: 'success' | 'error' | 'info';
  closing?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toast$ = this.toastSubject.asObservable();

  addToast(toast: Toast): void {
    const current = this.toastSubject.value;
    
    const id = Date.now();

    const newToast = {
      ...toast,
      id,
      closing: false
    };

    this.toastSubject.next([...current, newToast]);

    setTimeout(() => {
      const updated = this.toastSubject.value.map(t =>
        t.id === id
          ? { ...t, closing: true }
          : t
      );

      this.toastSubject.next(updated);
    }, 2700);

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number): void {
    const current = this.toastSubject.value;

    this.toastSubject.next(
      current.filter(toast => toast.id !== id)
    );
  }

  success(message: string): void {
    this.addToast({ message, type: 'success'});
  }
  
  info(message: string): void {
    this.addToast({ message, type: 'info'});
  }

  error(message: string): void {
    this.addToast({ message, type: 'error'});
  }
}
