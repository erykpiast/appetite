<section class="page__part--offer offer grid">

	<header class="page__part__header">
        <h2>{{ offer.template.title }}</h2>
    </header>

    <div class="page__part__content four-fifths">
		<app-gallery model="offer.template.pictures"></app-gallery>

        <div class="offer__description text-block">
        	<p>{{ offer.template.description }}</p>

            <p>{{ i18n.offer.remainingTime }}: <time datetime="{{ offer.endAt | date:'yyyy-MM-ddTHH:mm:ssZ' }}">{{ offer.endAt | forNow:'vi u' }}</time>
            </p>

        	<p>{{ i18n.offer.recipeFrom }}: <a ng-href="{{ offer.template.recipe.url }}">{{ offer.template.recipe.domain }}</a>
            </p>
        </div>
        
        <ul class="offer__comments no-bullets">
            <li class="offer__comment" ng-repeat="comment in offer.comments">
                <app-comments model="comment" show-owner-features="showOwnerFeatures()" response-accept-handler="acceptResponse(response)"></app-comments>
            </li>
        </ul>

        <app-add-comment onsubmit="addComment(comment)" onresponse="response(comment)" show-owner-features="showOwnerFeatures()"></app-add-comment>
    </div>

    <aside class="page__part__aside one-fifth">
        <app-offer-author model="offer.author"></app-offer-author>
    </aside>

</section>