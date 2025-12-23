import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-expenses-page',
    templateUrl: './expenses-page.component.html',
    styleUrls: ['./expenses-page.component.scss'],
    standalone: false
})
export class ExpensesPageComponent {
  constructor(private router: Router, private route: ActivatedRoute,){}

  goRecordExpenses(){
    this.router.navigate(['tabs','expenses', 'record'], {relativeTo: this.route.parent});
  }
  goReviewExpenses(){
    this.router.navigate(['tabs','expenses', 'view'], {relativeTo: this.route.parent});
  }
  goCheckPrice(){
    this.router.navigate(['tabs','expenses', 'check-price'], {relativeTo: this.route.parent});
  }

  goUpdateExpenses(){
    this.router.navigate(['tabs','expenses', 'update-expenses'], {relativeTo: this.route.parent});
  }
}
