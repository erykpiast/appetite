<section class="page__part--offer-create">
    
    <header class="page__part__header">
        <h2>{{ i18n.common.lastestOffers }}</h2>
    </header>

    <form class="page__part__content">
        <fieldset>
            <legend>{{ i18n.offer.add }}</legend>

            <div class="offer-create__title">
            	<label for="offer-create__title">{{ i18n.offer.create.title }}</label>
            	<input id="offer-create__title" type="text" value="" placeholder="{{ i18n.offer.create.example.title }}" />
            </div>

            <div class="offer-create__description">
            	<label for="offer-create__description">{{ i18n.offer.create.description }}</label>
            	<textarea id="offer-create__description" type="text" value="" placeholder="{{ i18n.offer.create.example.description }}" ></textarea>
            </div>

            <div class="offer-create__tags">
            	<label for="offer-create__tags">{{ i18n.offer.create.tags }}</label>
            	<input id="offer-create__tags" type="text" value="" placeholder="{{ i18n.offer.create.example.tags }}" />
            </div>

			<div class="offer-create__start-end">
            	<label for="offer-create__start">{{ i18n.offer.create.start }}</label>
            	<input id="offer-create__start" type="date" value="{{ defaultStartDate }}" />

            	<label for="offer-create__end">{{ i18n.offer.create.end }}</label>
            	<input id="offer-create__end" type="date" value="{{ defaultEndDate }}" />
            </div>            

            <button class="offer-create__submit" ng-click="addOffer()">{{ i18n.offer.create.submit }}</button>
    	</fieldset>
    </form>
    	
</section>