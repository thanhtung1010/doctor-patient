import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from './_share/share.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/outside' },
  { path: 'outside', loadChildren: () => import('./outside/outside.module').then(m => m.OutsideModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
