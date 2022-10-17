import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_share/_guards/auth.guard';

const routes: Routes = [
  {
    path: 'outside',
    loadChildren: () => import('./outside/outside.module').then(m => m.OutsideModule)
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./inside/inside.module').then(m => m.InsideModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {enableTracing: !1, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
