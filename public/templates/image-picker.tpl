<section class="image-picker">
	
	<header>
		{{ i18n.imagePicker.header }}
	</header>

	<ul class="image-picker__images horizontal">
		<li class="image-picker__image" ng-repeat="imageUrl in images">
			<img ng-src="{{ imageUrl }}" height="100" />
		</li>
	</ul>

	<div class="image-picker__adder">

		<button class="image-picker__adder__add-next" ng-click="showForm = true" ng-hide="!!showForm">{{ i18n.imagePicker.addNext }}</button>

		<form class="image-picker__adder__form" ng-show="!!showForm">
			<fieldset>
				<legend>{{ i18n.imagePicker.adderHeader }}</legend>

				<img class="image-picker__adder__form__preview" ng-src="{{ imageProto.url }}" height="100" />

				<label for="image-picker__adder__form__url">{{ i18n.imagePicker.pasteUrl }}</label>
            	<input id="image-picker__adder__form__url" type="url" value="" placeholder="{{ i18n.imagePicker.urlExample }}" ng-model="imageProto.url" />

            	<button class="image-picker__adder__form__apply" ng-click="addImage()">{{ i18n.common.apply }}</button>

			</fieldset>
		</form>

	</div>

</section>