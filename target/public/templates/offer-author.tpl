<section class="offer-author" ng-click="goTo('user.details', { id: author.id })">
	
	<header class="offer-author__header">
		<h3 class="offer-author__name">{{ author.fullName }}</h3>

		<img ng-src="/images/{{ author.avatar.filename }}" />
	</header>

</section>