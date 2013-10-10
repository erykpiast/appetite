<div>
    <section>
    
        <header>
            <h2>{{ i18n.common.lastestOffers }}</h2>
        </header>
    
        <ul>
    	    <li ng-repeat="offer in offers">
    	        <app-offer-thumbnail model="offer"></app-offer-thumbnail>
    	    </li>
    	</ul>
    	
    </section>
</div>