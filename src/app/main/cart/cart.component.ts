import { Component, inject, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IJwtDecoded } from '../../models/token.interface';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

import { MaterialModule } from '../../sharing/module/material';
import { EmptyCartComponent } from '../../sharing/component/empty-cart/empty-cart.component';
import { PrefixBackendStaticPipe } from '../../sharing/pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../sharing/pipe/currency-custom.pipe';
import { NumberInputComponent } from '../../sharing/component/number-input/number-input.component';

import { Observable, Subscription, take, map, lastValueFrom, filter } from 'rxjs';
import { CartEntity, CartItemEntity } from '../../entity/cart.entity';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../sharing/modal/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../models/confirmation-dialog.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterLink,

    EmptyCartComponent,
    NumberInputComponent,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    MaterialModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly renderer2: Renderer2 = inject(Renderer2);
  private readonly cartService: CartService = inject(CartService)
  private readonly authService: AuthService = inject(AuthService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly matDialog: MatDialog = inject(MatDialog);

  cart$: Observable<CartEntity> = this.cartService.cartStoraged$;

  jwtDecoded$: Observable<IJwtDecoded | null> = this.authService.jwtPayload$;

  private subscription: Subscription = new Subscription();

  cartItemsQuantityChange(cartItem: CartItemEntity, value: number) {
    this.cartService.changeQuantity(cartItem, value)
  }

  removeCartItem(cartItem: CartItemEntity, cartItemElement: HTMLDivElement) {
    const data: ConfirmationDialogData = {
      title: $localize`:@@cart.confirmationDialog.title:Xác nhận xóa sản phẩm`,
      message: $localize`:@@cart.confirmationDialog.message:Bạn có chắc chắn muốn xóa sản phẩm "${cartItem.product.name}" khỏi giỏ hàng không?`,
      confirmText: $localize`:@@cart.confirmationDialog.confirmText:Có`,
      cancelText: $localize`:@@cart.confirmationDialog.confircancelTextmText:Không`,
      type: 'warning'
    }
    this.matDialog.open(ConfirmationDialogComponent, {
      data
    }).afterClosed().pipe(
      take(1),
      filter(result => !!result),
    ).subscribe(() => {
      this.renderer2.addClass(cartItemElement, 'cart-item-removed');
      setTimeout(() => {
        this.cartService.removeItem(cartItem);
      }, 450);
    });
  }

  async order() {
    const cartItems: CartItemEntity[] = await lastValueFrom(this.cart$.pipe(
      take(1),
      map(cart => cart.cartItems)
    ));

    if (cartItems.length === 0) {
      this.toastService.shortToastError(
        $localize`:@@cart.emptyTitle:Giỏ hàng của bạn đang trống!`,
        $localize`:@@cart.emptyMessage:Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.`
      );
      return;
    }
    this.router.navigate(['/thanh-toan']);
  }

  ngOnDestroy() {
    // if (this.customerForm && this.customerForm.valid) {
    //   let address: Address = this.addressValue();
    //   this.cartService.setDelivery(address);
    // }
    this.subscription.unsubscribe();
  }
}
