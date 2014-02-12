<section class="page__content__offer--create offer">

    <div class="page__content__column--left">
        <div  ng-form="offerTemplate" class="offer--create__form--template">
            <header class="offer__header">
            	<h2 class="form__field"
                    app-edit-in-place="offer.template.title"
                    label="{{ i18n.offer.create.title }}"
                    input-attrs="{
                        'placeholder': i18n.offer.create.example.title,
                        'ng-required': true,
                        'ng-maxlength': 50
                    }"
                    data-title="{{ i18n.offer.create.title }} – {{ i18n.offer.create.clickToEdit }}"></h2>
            </header>


            <div class="offer__content">

                <div class="offer__pictures">
                    
                    <app-image-picker model="offer.template.pictures"></app-image-picker>

                </div>

                <div class="offer__description">
                    <p  class="offer__description__paragraph form__field"
                        app-edit-in-place="offer.template.description"
                        label="{{ i18n.offer.create.description }}"
                        input-type="textarea"
                        input-attrs="{
                            'placeholder': i18n.offer.create.example.description,
                            'ng-required': true,
                            'ng-maxlength': 300
                        }"
                        data-title="{{ i18n.offer.create.description }} – {{ i18n.offer.create.clickToEdit }}"></p>
                </div>

                <div class="offer__tags">
                    <p class="form__field">
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
                    </p>
                </div>

                <div class="offer__source">
                    <p class="form__field">
                        {{ i18n.offer.recipeFrom }}
                        <a  class="offer__source__link form__field"
                            app-edit-in-place="offer.template.recipe"
                            label="{{ i18n.offer.create.recipe }}"
                            input-type="url"
                            input-attrs="{
                                'placeholder': i18n.offer.create.example.recipe,
                                'ng-required': true
                            }"
                            data-title="{{ i18n.offer.create.recipe }} – {{ i18n.offer.create.clickToEdit }}"></a>
                    </p>
                </div>

                <button 
                    class="offer__submit" 
                    type="submit"
                    ng-click="submitTemplate()" 
                    ng-disabled="!formTemplate.$valid" >
                    {{ i18n.offer.create.submitTemplate }}
                </button>
                
            </div>
        </div>

        <section ng-form="offerDetails" class="offer--create__form--details">
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
        </div>
    </div>
    	
</section>