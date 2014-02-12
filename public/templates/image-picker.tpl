<section class="image-picker">
	
	<header class="image-picker__header">
		{{ i18n.imagePicker.header }}
	</header>

	<div class="image-picker__images">
		<ul class="image-picker__images__list"
			ng-hide="!!showForm"
			perfect-scrollbar="{
				suppressScrollY: true,
				useBothWheelAxes: true
			}">
			<li 
				class="image-picker__images__image"
				ng-repeat="imageUrl in images"
				ng-click="removeImage(imageUrl)">
				<img ng-src="{{ imageUrl }}" />
			</li>
		</ul>
	</div>

	<div ng-class="{
			'image-picker__adder': !showForm,
			'image-picker__adder--active': !!showForm
		}">

		<button
			class="image-picker__adder__add-next"
			ng-click="!maxReached && (showForm = true)"
			ng-hide="!!showForm || !!maxReached"
			data-title="{{ i18n.imagePicker.addNext }}">
				{{ i18n.imagePicker.addNext }}
			</button>

		<form class="image-picker__adder__form" ng-show="!!showForm">
			<fieldset>
				<legend>{{ i18n.imagePicker.adderHeader }}</legend>

				<img
					class="image-picker__adder__form__preview"
					ng-src="{{ imageProto.url }}"
					ng-show="imageProto.url.length > 0" />

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