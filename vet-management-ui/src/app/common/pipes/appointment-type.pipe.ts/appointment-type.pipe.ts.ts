import { Pipe, PipeTransform } from "@angular/core";
import { AppointmentType } from "../../../models/appointment-type";

@Pipe({
  name: 'appointmentType',
  standalone: true
})
export class AppointmentTypePipe implements PipeTransform{

  transform(type: AppointmentType): string {
    switch (type) {
      case AppointmentType.WalkIn:
        return 'Walk-in';
      default:
        return type;
    }
  }
}