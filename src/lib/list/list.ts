/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Optional,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {
  CanDisableRipple,
  CanDisableRippleCtor,
  MatLine,
  setLines,
  mixinDisableRipple,
} from '@angular/material/core';

// Boilerplate for applying mixins to MatList.
/** @docs-private */
export class MatListBase {}
export const _MatListMixinBase: CanDisableRippleCtor & typeof MatListBase =
    mixinDisableRipple(MatListBase);

// Boilerplate for applying mixins to MatListItem.
/** @docs-private */
export class MatListItemBase {}
export const _MatListItemMixinBase: CanDisableRippleCtor & typeof MatListItemBase =
    mixinDisableRipple(MatListItemBase);

@Component({
  moduleId: module.id,
  selector: 'mat-nav-list',
  exportAs: 'matNavList',
  host: {
    'role': 'navigation',
    'class': 'mat-nav-list'
  },
  templateUrl: 'list.html',
  styleUrls: ['list.css'],
  inputs: ['disableRipple'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatNavList extends _MatListMixinBase implements CanDisableRipple {}

@Component({
  moduleId: module.id,
  selector: 'mat-list, mat-action-list',
  exportAs: 'matList',
  templateUrl: 'list.html',
  host: {'class': 'mat-list'},
  styleUrls: ['list.css'],
  inputs: ['disableRipple'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatList extends _MatListMixinBase implements CanDisableRipple {
  /**
   * @deprecated _elementRef parameter to be made required.
   * @breaking-change 8.0.0
   */
  constructor(private _elementRef?: ElementRef<HTMLElement>) {
    super();
  }

  _getListType(): 'list' | 'action-list' | null {
    const elementRef = this._elementRef;

    // @breaking-change 8.0.0 Remove null check once _elementRef is a required param.
    if (elementRef) {
      const nodeName = elementRef.nativeElement.nodeName.toLowerCase();

      if (nodeName === 'mat-list') {
        return 'list';
      }

      if (nodeName === 'mat-action-list') {
        return 'action-list';
      }
    }

    return null;
  }
}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[mat-list-avatar], [matListAvatar]',
  host: {'class': 'mat-list-avatar'}
})
export class MatListAvatarCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[mat-list-icon], [matListIcon]',
  host: {'class': 'mat-list-icon'}
})
export class MatListIconCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[mat-subheader], [matSubheader]',
  host: {'class': 'mat-subheader'}
})
export class MatListSubheaderCssMatStyler {}

/** An item within a Material Design list. */
@Component({
  moduleId: module.id,
  selector: 'mat-list-item, a[mat-list-item], button[mat-list-item]',
  exportAs: 'matListItem',
  host: {
    'class': 'mat-list-item',
    // @breaking-change 8.0.0 Remove `mat-list-item-avatar` in favor of `mat-list-item-with-avatar`.
    '[class.mat-list-item-avatar]': '_avatar || _icon',
    '[class.mat-list-item-with-avatar]': '_avatar || _icon',
  },
  inputs: ['disableRipple'],
  templateUrl: 'list-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatListItem extends _MatListItemMixinBase implements AfterContentInit,
    CanDisableRipple {
  private _isInteractiveList: boolean = false;
  private _list?: MatNavList | MatList;

  @ContentChildren(MatLine) _lines: QueryList<MatLine>;
  @ContentChild(MatListAvatarCssMatStyler) _avatar: MatListAvatarCssMatStyler;
  @ContentChild(MatListIconCssMatStyler) _icon: MatListIconCssMatStyler;

  constructor(private _element: ElementRef<HTMLElement>,
              @Optional() navList?: MatNavList,
              @Optional() list?: MatList) {
    super();
    this._isInteractiveList = !!(navList || (list && list._getListType() === 'action-list'));
    this._list = navList || list;

    // If no type attributed is specified for <button>, set it to "button".
    // If a type attribute is already specified, do nothing.
    const element = this._getHostElement();

    if (element.nodeName.toLowerCase() === 'button' && !element.hasAttribute('type')) {
      element.setAttribute('type', 'button');
    }
  }

  ngAfterContentInit() {
    setLines(this._lines, this._element);
  }

  /** Whether this list item should show a ripple effect when clicked. */
  _isRippleDisabled() {
    return !this._isInteractiveList || this.disableRipple ||
           !!(this._list && this._list.disableRipple);
  }

  /** Retrieves the DOM element of the component host. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }
}
