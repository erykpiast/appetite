<section class="page__content__offer offer">

    <div class="page__content__column--left">
        <header class="offer__header">
            <h2>{{ offer.template.title }}</h2>
        </header>

        <div class="offer__content">
            <div class="offer__pictures">
                <div class="offer__pictures__wrapper">
                    <ul class="offer__pictures__list"
                        perfect-scrollbar="{
                            suppressScrollY: true,
                            useBothWheelAxes: true
                        }">
                        <li class="offer__pictures__picture" ng-repeat="picture in offer.template.pictures">
                            <img ng-src="/images/{{ picture.filename }}" alt="" />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="offer__order">
                <p class="offer__order__details">
                    <span class="offer__order__details__amount"
                        ng-bind="offer.amount && offer.unit && formatAmount(offer.amount, offer.unit)"></span>
                    –
                    <strong class="offer__order__details__amount">
                        {{ offer.price }} {{ i18n.offer.order.currency }}
                    </strong>
                </p>
                <button class="offer__order__button"
                    ng-click="order()"
                    ng-bind="i18n.offer.order.doOrder"></button>
            </div>

            <p  class="offer__description"
                ng-bind="offer.template.description"
                ></p>

            <ul class="offer__tags">
                <li class="offer__tags__tag"
                    ng-repeat="tag in offer.template.tags">
                    <a  ui-shref="tags.details({ id: tag.id })"
                        ng-bind="tag.text"></a>
                </li>
            </ul>

            <p class="offer__source">
                <span class="offer__source__label"
                    ui-sref="recipes.details({ id: offer.template.recipe.id })"
                    ng-bind="i18n.offer.recipeFrom"></span>
                <a class="offer__source__link"
                    ng-bind="offer.template.recipe.domain"></a>
            </p>
        </div>

        <section class="offer__comments">
            <header class="offer__comments__header">
                <h3>{{ i18n.comments.header }}</h3>
            </header>

            <app-comments
                model="offer.comments"
                on-answer="setParentOfNewComment(comment)"
                show-owner-features="showOwnerFeatures()"
                show-user-features="showUserFeatures()"
                list-class-name="offer__comments__list"
                list-element-class-name="offer__comments__comment">
            </app-comments>

            <app-add-offer-comment
                class="offer__comments__add"
                on-comment="addComment(comment)"
                on-response="response(comment)"
                comment-parent="newCommentParent"
                show-owner-features="showOwnerFeatures()"
                author="currentUser">
            </app-add-offer-comment>
        </section>
    </div>
        
</section>