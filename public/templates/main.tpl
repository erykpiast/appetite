<div>
    <section>
    
        <header>
            <h2>{{ i18n.common.lastestOffers }}</h2>
        </header>
    
        <ul>
    	    <li>
    	        <app-offer-thumbnail ng-repeat="offer in offers" model="offer"></app-offer-thumbnail>
    	    </li>
    	</ul>
    	
    </section>
</div>