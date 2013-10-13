<section class="page__main">
    
    <header class="page--header">
        <h2>{{ i18n.common.lastestOffers }}</h2>
    </header>

    <div class="page--content">
        <ul class="offers horizontal">
    	    <li ng-repeat="offer in offers">
    	        <app-offer-thumbnail model="offer"></app-offer-thumbnail>
    	    </li>
    	</ul>
    </div>
    	
</section>