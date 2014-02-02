<section class="image-picker">
	
	<header class="image-picker__header">
		{{ i18n.imagePicker.header }}
	</header>

	<ul class="image-picker__images"
		ng-hide="!!showForm"
		perfect-scrollbar="{
			suppressScrollY: true,
			useBothWheelAxes: true
		}">
		<li class="image-picker__images__image" ng-repeat="imageUrl in images">
			<img ng-src="{{ imageUrl }}" />
		</li>
	</ul>

	<div ng-class="{
			'image-picker__adder': !showForm,
			'image-picker__adder--active': !!showForm
		}">

		<button
			class="image-picker__adder__add-next"
			ng-click="!maxReached && (showForm = true)"
			ng-hide="!!showForm || !!maxReached"
			data-title="{{ i18n.imagePicker.addNext }}"></button>

		<form class="image-picker__adder__form" ng-show="!!showForm">
			<fieldset>
				<legend>{{ i18n.imagePicker.adderHeader }}</legend>

				<img
					class="image-picker__adder__form__preview"
					ng-src="{{ imageProto.url }}" />

				<div class="image-picker__adder__form__input">
					<label for="image-picker__adder__form__url">{{ i18n.imagePicker.pasteUrl }}</label>
	            	<input
	            		id="image-picker__adder__form__url"
	            		type="url"
	            		value=""
	            		placeholder="{{ i18n.imagePicker.urlExample }}"
	            		ng-model="imageProto.url" />

            		<button
            			class="image-picker__adder__form__input__button--apply"
            			ng-click="addImage()">{{ i18n.common.apply }}</button>
    				<button
    					class="image-picker__adder__form__input__button--cancel"
    					ng-click="cancelAdding()">{{ i18n.common.cancel }}</button>
	            </div>

			</fieldset>
		</form>

	</div>

</section>