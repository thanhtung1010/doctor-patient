import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROUTING_DEFINED } from './_share/_enum/router';
import { AuthGuard } from './_share/_guards/auth.guard';

const routes: Routes = [
  {
    path: ROUTING_DEFINED.OUTSIDE,
    loadChildren: () => import('./outside/outside.module').then(m => m.OutsideModule)
  },
  {
    path: '',
    loadChildren: () => import('./inside/inside.module').then(m => m.InsideModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ROUTING_DEFINED.OUTSIDE
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !1, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
