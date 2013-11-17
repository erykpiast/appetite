<section class="page__part--user user grid">

	<header class="page__part__header">
		<img class="user__avatar" ng-src="/static/images/{{ user.avatar.filename }}" height="300px" />
        <h2>{{ user.fullName }}</h2>
        <a class="user__site" ng-href="{{ user.site }}">{{ user.site | formatUrl:'domain' }}</a>
    </header>

    <div class="page__part__content four-fifths">
    	<h3> {{ i18n.user.currentOffers }}</h3>
		<ul class="user__offers grid">
    	    <li ng-repeat="offer in user.offers" class="grid__item one-quarter">
    	        <app-offer-thumbnail model="offer"></app-offer-thumbnail>
    	    </li>
    	</ul>
    </div>

    <aside class="page__part__aside one-fifth">
        
    </aside>

</section>