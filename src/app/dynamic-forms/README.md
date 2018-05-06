# Dynamic Forms Module

This is an attempt to implement the official Angular paradigm of [dynamic forms](https://angular.io/guide/dynamic-form).
This module is also inspired from the already heavily developed [ng-dynamic-forms](https://github.com/udos86/ng-dynamic-forms) library.


  * [Basic Usage](#basic-usage)
    + [1. Import module](#1-import-module)
    + [2. Define the form dynamic controls](#2-define-the-form-dynamic-controls)
  * [DynamicFormComponent input properties](#dynamicformcomponent-input-properties)
  * [DynamicFormComponent output properties](#dynamicformcomponent-output-properties)
  * [Form Groups](#form-groups)
  * [Custom (rendered) controls](#custom--rendered--controls)
  * [Form Arrays](#form-arrays)
    + [Rendering](#rendering)
  * [Validation](#validation)

## Basic Usage

### 1. Import module

To start developing with dynamic forms the module must be imported in your module:

```typescript
import {DynamicFormsModule} from './dynamic-forms/dynamic-forms.module';
// ...

@NgModule({

    imports: [
        ReactiveFormsModule,
        DynamicFormModule,
        // ...
    ]
})
```
### 2. Define the form dynamic controls

At the time of writing the following type of dynamic controls are supported:

* ArrayControl
* AutocompleteControl
* CalendarControl
* GroupControl
* TextboxControl

These controls all extend from a BaseControl (which defines some generic configuration options, e.g. 'label')
These classes define their control-specific options and they are all rendered using PrimeNG components.

The base component of the dynamic forms module is the DynamicFormComponent which expects an array of controls so the following
 will create a form with one text field:

```typescript
let controls: BaseControl<string>[] = [
    new TextBoxControl({
        key: 'textBoxExample',
        label: 'Text Box Example',
        order: 1
    })
];
```

~ 3. Add a DynamicFormComponent to your template

For the simple example above you just need to add the dynamic form component to your template referencing the array of controls:

```angular2html
<dynamic-form [controls]="controls">

</dynamic-form>
```

This will create a new Angular FormGroup and render all the controls in your page.

## DynamicFormComponent input properties

The following properties can be passed to the dynamic form component (besides 'controls'):

* `customControls`: This is a separate array of controls which is used to add controls that will be rendered manually
(using the dynamic-form-control component explicitly)

* `groupValidators`: This is an array of ValidatorFn (validation functions) that will be added to the FormGroup level for cross-field validation.

* `parentForm`: This is a FormGroup that we consider a parent of this form and that the newly created FormGroup will be added to.

* `formName`: This is the name that will be used as a key to the parent FormGroup (if a parentForm is provided).

* `showErrors`: If set to true the FormGroup errors will be shown on top of the form

* `showNestedFormGroupErrors`: If set to true all the errors of the FormGroup children will be shown (together with the FormGroup errors)

* `controlsPerRow`: In case we want the form to be rendered with multiple controls per row we can set a number here

* `value`: The part of the data model that should be binded to the form (if applicable)

* `form`: If the FormGroup for this form has been created previously, there is no need to re-create it so we pass it here to use the available group



## DynamicFormComponent output properties

* `formSubmit`: In case we want an event to be emitted when the form is submitted
NOTE: This is not being used at the moment, needs testing.

* `formCreated`: This event will be emitted after the dynamic form's FormGroup creation, so we can get a reference to the FormGroup


## Form Groups

One important feature of Angular reactive forms is the ability to group controls into groups.
This is very useful for logical grouping but also for adding validators in the group level (cross-field validation,
will be discussed in a separate section).

The dynamic form module supports the usage of groups with the GroupControl.

To use the GroupControl you add it to your list of controls:

```typescript
new GroupControl({
    key: 'groupExample',
    groupControls: [...],
    // ...
});
```

When adding this control (as part of the array of `controls`) as input to the dynamic form component controls,
a nested dynamic form will be rendered inside the parent dynamic form with input as controls the `groupControls` array.
It will also define another `@Input` property called `parentForm`. As a result, the FormGroup created from the nested dynamic form
will be added to its parent FormGroup (which is the original dynamic form).

CAUTION: If the only control in the controls array is a GroupControl the result will be a FormGroup inside another FormGroup.
This does not seem to be a useful functionality so it was decided that an error will be thrown informing the user
 that he might have passed wrongly the controls to the controls array.


## Custom (rendered) controls

Using the `customControls` property of the dynamic form we can create FormControls which are not rendered together with the rest of the `controls`.
This was initially added as a feature because we might want to give complete control to the user to where the control is rendered without reverting back
to reactive forms. To render manually the control the DynamicFormControl component must be used:

```angular2html
 <!--NOTE: this ui-g class is absolutely required so as to not break the grid layout!-->
        <div class="ui-g">
            <dynamic-form-control [control]="generalSummary" [form]="dynamicForm">
            </dynamic-form-control>
        </div>
```

NOTE: The custom controls feature has been extended to support the requirement of creating nested FormGroups 
that will not be rendered (see Form Array section).

## Form Arrays

Form arrays are useful when you don't know beforehand how many controls will be needed and when they can be added dynamically at runtime.

To create a form array we first need to create an ArrayControl:

```typescript
let array = new ArrayControl({
    key: 'arrayExample',
    arrayControls: [
        new GroupControl(...),
        // ...
    ]
});
```

The difference with other kind of controls is that the array controls are not rendered automatically but rather on demand.

If we provide the ArrayControl directly in a dynamic form as an @Input, the controls of the array will be created and added to a new Angular FormArray.
But the controls will **NOT** be rendered.

CAUTION: To create correctly the FormArray with all its nested FormGroups the array control must be passed in the `customControls` property rather than
the `controls` property of the dynamic form. This is because that in the normal rendering scenario, nested FormGroups are not created in the dynamic form,
they are passed as input to nested dynamic forms so as to be rendered as separate forms. This means that if we pass the array to the `controls`
input property the nested FormGroups will **NOT** be created:

```angular2html
<dynamic-form [customControls]="array"></dynamic-form>
```

### Rendering

The rendering of the array is left to the user. To render for example a FormGroup which was created inside a FormArray, we must manually create a new 
dynamic form and explicitly pass the FormGroup controls to the `controls` `@Input` parameter. 
We must also set the `@Input` property `form` which informs the dynamic form component that a FormGroup already exists
and **no new FormGroup** must be created.

To add a new element in the array after it was created initially (dynamic addition of array elements), the DynamicFormService must be used. 
The `toFormGroup` function must be called of the service passing as arguments the `customControls` (not the `controls` so as to create nested FormGroups)
the groupValidators (if available) and the FormArray that was created previously.

NOTE: This means that somehow we must get a reference to the FormArray which was created in the previous step. 
This is done by passing a method reference to the `@Output` parameter `formCreated`. This event will be fired after the FormArray (or FormGroup) 
is created. In this method we can get the reference of the FormArray:

```angular2html
<dynamic-form [controls]="array[0].controls" [parent]="parentForm" (formCreated)="retrieveFormArray($event)">

</dynamic-form>
```


## Validation

The module supports centralised validation management. 

### Setting up validators
This is achieved initially by defining all validation rules when defining the Dynamic Form Controls. 
Validations can be added in the level of a GroupControl (`groupValidators`), ArrayControl (`arrayValidators`) and individual input controls (`validators`).
In the case of group and array the validators are defined as an array of Angular `ValidatorFn` functions, i.e.:

```typescript
new GroupControl({
    groupValidators: [
        this.petrolFormValidator.numOfSampleFrequencyValidation(),
    ]
})
```
When setting individual control validators the definition differs as the array of validators must contain our own custom validator configuration
object `ValidationConfig`. This way the user can define at the same place the validator, a placeholder for the error (`formField`) and the exact 
validation error message:

```typescript
 validators: [
    {
        formError: 'minlength',
        validator: Validators.minLength(5),
        validationMessage: 'Min length is 5'
    }
]
```

NOTE: This differentiation betwwen group/array validators and individual control validators might need to be addressed...

### Showing validation errors

The dynamic form component has two `@Input` properties concerning validation errors: 
If `showErrors` is set to true the FormGroup errors of the specific dynamic form will be shown on top of the form.
If `showNestedErrors` is set to true all the nested grop errors will also be shown at the top.

The dynamic form control component is responsible for showing individual control components, by aggregating all field error messages in one
 and showing it bellow the field.
 
 ### Marking tabs as invalid
 
 NOTE: This feature is under development, not stable yet.
 
 There is also the possibility to mark a PrimeNG tab as invalid when an error occurs in its FormGroup (checking recursively in all nested FormGroups).
 This is achieved using the `tabForm` directive, passing the FormGroup we want the tab to check for errors:
 
 ```angular2html
<p-tabPanel [tabForm]="formGroup">
// ...
</p-tabPanel>
```


