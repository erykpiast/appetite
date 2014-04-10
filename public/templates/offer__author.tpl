<section class="offer__author" ui-sref="user.details({ id: author.id })">
	
	<header class="offer__author__header">
		<h2>{{ i18n.offer.author.header }}</h2>
	</header>

	<div class="offer__author__content">
		<div class="offer__author__avatar">
			<img ng-src="images/{{ author.avatar.filename }}">
		</div>
		<strong class="offer__author__name">{{ author.fullName }}</strong>
		<span class="offer__author__rating">{{ author.rating }}</span>
	</div>

</section>