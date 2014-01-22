<section class="page__content__offer--create">

    <form name="formTemplate" class="offer--create__form--template">
        <fieldset>
            <legend>{{ i18n.offer.create.templateHeader }}</legend>

            <div class="offer__title">
            	<h2 class="form__field"
                    app-edit-in-place="offer.template.title"
                    label="{{ i18n.offer.create.title }}"
                    default-active="true"
                    input-attrs="{
                        'placeholder': i18n.offer.create.example.title,
                        'ng-required': true,
                        'ng-minlength': 10,
                        'ng-maxlength': 50
                    }"></h2>
            </div>

            <div class="offer__content">

                <div class="offer__pictures form__field">
                    
                    <app-image-picker model="offer.template.pictures"></app-image-picker>

                </div>

                <div class="offer__description">
                    <p  class="form__field"
                        app-edit-in-place="offer.template.description"
                        label="{{ i18n.offer.create.description }}"
                        input-type="textarea"
                        input-attrs="{
                            'placeholder': i18n.offer.create.example.description,
                            'ng-required': true,
                            'ng-maxlength': 300
                        }"></p>
                </div>

                <div class="offer__source form__field">
                    <label for="offer__source">{{ i18n.offer.create.recipe }}</label>
                    <input
                        id="offer__source"
                        type="url"
                        value=""
                        placeholder="{{ i18n.offer.create.example.recipe }}"
                        ng-model="offer.template.recipe"
                        ng-required="true" />
                </div>

                <div class="offer__tags form__field">
                	<label for="offer__tags">{{ i18n.offer.create.tags }}</label>
                	<input
                        id="offer__tags"
                        type="text"
                        value=""
                        placeholder="{{ i18n.offer.create.example.tags }}"
                        ng-model="offer.template.tags"
                        ng-required="true"
                        ui-select2="{
                            multiple: true,
                            simple_tags: true,
                            maximumSelectionSize: 5,
                            tags: [ ]
                        }" />
                </div>

                <button 
                    class="offer__submit" 
                    type="submit"
                    ng-click="submitTemplate()" 
                    ng-disabled="!formTemplate.$valid" >
                    {{ i18n.offer.create.submitTemplate }}
                </button>
                
            </div>

        </fieldset>
    </form>

    <form name="formOffer" class="offer--create__form--details">
        <fieldset>
            <legend>{{ i18n.offer.create.detailsHeader }}</legend>

            <div class="offer__place">
                <label for="offer__place">{{ i18n.offer.create.place }}</label>
                <input 
                    id="offer__place" 
                    type="text" 
                    value="" 
                    placeholder="{{ i18n.offer.create.example.place }}" 
                    ng-model="offer.details.place"
                    ng-required="true"
                    ng-minlength="2"
                    ng-maxlength="20" />
            </div>

			<div class="offer__start-end">
            	<label for="offer__start">{{ i18n.offer.create.start }}</label>
            	<input 
                    id="offer__start"  
                    ng-model="offer.details.startAt"
                    ng-required="true"
                    ui-date="{
                        dateFormat: 'dd/mm/yy',
                        firstDay: 1,
                        minDate: 0,
                        maxDate: '+1w',
                        hideIfNoPrevNext: true,
                        dayNames:  i18n.dates.dayNames,
                        dayNamesShort: i18n.dates.dayNamesShort,
                        dayNamesMin: i18n.dates.dayNamesMin,
                        monthNames: i18n.dates.monthNames,
                        showOtherMonths: true,
                        selectOtherMonths: true
                    }" />

            	<label for="offer__end">{{ i18n.offer.create.end }}</label>
            	<input 
                    id="offer__end"
                    ng-model="offer.details.endAt"
                    ng-required="true"
                    ui-date="{
                        dateFormat: 'dd/mm/yy',
                        firstDay: 1,
                        minDate: offer.details.startAt,
                        maxDate: getMaxEndDate(),
                        hideIfNoPrevNext: true,
                        dayNames:  i18n.dates.dayNames,
                        dayNamesShort: i18n.dates.dayNamesShort,
                        dayNamesMin: i18n.dates.dayNamesMin,
                        monthNames: i18n.dates.monthNames,
                        showOtherMonths: true,
                        selectOtherMonths: true
                    }" />
            </div>

            <button 
                class="offer__submit" 
                type="submit"
                ng-click="startOffer()" 
                ng-disabled="!(formOffer.$valid && formTemplate.$valid)">
                {{ i18n.offer.create.startOffer }}
            </button>
        </fieldset>
    </form>
    	
</section>