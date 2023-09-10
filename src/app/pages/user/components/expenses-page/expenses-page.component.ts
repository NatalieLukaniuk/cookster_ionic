import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss']
})
export class ExpensesPageComponent {
  constructor(private router: Router, private route: ActivatedRoute,){}

  goRecordExpenses(){
    this.router.navigate(['tabs','expenses', 'record'], {relativeTo: this.route.parent});
  }
}
