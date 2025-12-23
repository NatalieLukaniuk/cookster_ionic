import { PreparationStep } from '../../../../models/recipies.models';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-add-step',
    templateUrl: './add-step.component.html',
    styleUrls: ['./add-step.component.scss'],
    standalone: false
})
export class AddStepComponent implements OnInit {
  @Output() addNewStep = new EventEmitter<PreparationStep>();
  description = '';
  activeTime = '';
  passivetime = '';
  constructor() {}

  ngOnInit() {}

  addStep() {
    let step: PreparationStep = {
      description: this.description,
      timeActive: +this.activeTime,
      timePassive: +this.passivetime,
    };
    this.addNewStep.emit(step);
    this.clear();
  }

  get isAddDisabled() {
    return (
      !this.description.length ||
      !this.activeTime.length ||
      !this.passivetime.length
    );
  }

  clear() {
    this.description = '';
    this.activeTime = '';
    this.passivetime = '';
  }
}
