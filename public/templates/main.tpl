<section class="page__part--main grid">
    
    <header class="page__part__header">
        <h2>{{ i18n.common.lastestOffers }}</h2>
    </header>

    <div class="page__part__content">
        <ul class="offers grid">
    	    <li ng-repeat="offer in offers" class="grid__item one-quarter">
    	        <app-offer-thumbnail model="offer"></app-offer-thumbnail>
    	    </li>
    	</ul>
    </div>
    	
</section>