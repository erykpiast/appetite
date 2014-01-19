<section class="page__part--offer-create">
    
    <header class="page__part__header">
        <h2>{{ i18n.common.lastestOffers }}</h2>
    </header>

    <div class="page__part__content">
        <form name="formTemplate">
            <fieldset>
                <legend>{{ i18n.offer.create.templateHeader }}</legend>

                <div class="offer-create__title">
                	<label for="offer-create__title">{{ i18n.offer.create.title }}</label>
                	<input
                        id="offer-create__title"
                        type="text"
                        value=""
                        placeholder="{{ i18n.offer.create.example.title }}"
                        ng-model="offer.template.title"
                        ng-required="true"
                        ng-minlength="10"
                        ng-maxlength="50" />
                </div>

                <div class="offer-create__pictures">
                    
                    <app-image-picker model="offer.template.pictures"></app-image-picker>

                </div>

                <div class="offer-create__description">
                	<label for="offer-create__description">{{ i18n.offer.create.description }}</label>
                	<textarea
                        id="offer-create__description"
                        type="text"
                        value=""
                        placeholder="{{ i18n.offer.create.example.description }}"
                        ng-model="offer.template.description"
                        ng-required="true"
                        ng-minlength="60"
                        ng-maxlength="300" >
                    </textarea>
                </div>

                <div class="offer-create__recipe">
                    <label for="offer-create__recipe">{{ i18n.offer.create.recipe }}</label>
                    <input
                        id="offer-create__recipe"
                        type="url"
                        value=""
                        placeholder="{{ i18n.offer.create.example.recipe }}"
                        ng-model="offer.template.recipe"
                        ng-required="true" />
                </div>

                <div class="offer-create__tags">
                	<label for="offer-create__tags">{{ i18n.offer.create.tags }}</label>
                	<input
                        id="offer-create__tags"
                        type="text"
                        value=""
                        placeholder="{{ i18n.offer.create.example.tags }}"
                        ng-model="offer.template.tags"
                        ng-required="true"
                        ng-minlength="3"
                        ng-maxlength="20" />
                </div>

                <button 
                    class="offer-create__submit" 
                    type="submit"
                    ng-click="submitTemplate()" 
                    ng-disabled="!formTemplate.$valid" >
                    {{ i18n.offer.create.submitTemplate }}
                </button>

            </fieldset>
        </form>

        <form name="formOffer">
            <fieldset>
                <legend>{{ i18n.offer.create.detailsHeader }}</legend>

                <div class="offer-create__place">
                    <label for="offer-create__place">{{ i18n.offer.create.place }}</label>
                    <input 
                        id="offer-create__place" 
                        type="text" 
                        value="" 
                        placeholder="{{ i18n.offer.create.example.place }}" 
                        ng-model="offer.details.place"
                        ng-required="true"
                        ng-minlength="2"
                        ng-maxlength="20" />
                </div>

    			<div class="offer-create__start-end">
                	<label for="offer-create__start">{{ i18n.offer.create.start }}</label>
                	<input 
                        id="offer-create__start"  
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

                	<label for="offer-create__end">{{ i18n.offer.create.end }}</label>
                	<input 
                        id="offer-create__end"
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
                    class="offer-create__submit" 
                    type="submit"
                    ng-click="startOffer()" 
                    ng-disabled="!(formOffer.$valid && formTemplate.$valid)">
                    {{ i18n.offer.create.startOffer }}
                </button>
            </fieldset>
        </ng-form>
    </div>
    	
</section>