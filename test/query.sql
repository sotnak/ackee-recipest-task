select reciep_id, AVG(rating_value)::numeric(4,2)
from "reviews"
group by reciep_id
having AVG(rating_value) > 7;

with reciep_rating as (
    select reciep_id, AVG(rating_value) as average_rating
    from reviews
    group by reciep_id
    having AVG(rating_value) > 8
)
select id, name, main_ingredient as mainIngredient, publish_time as publishTime, average_rating as averageRating
from reciep_rating join recieps on reciep_rating.reciep_id = recieps.id
order by publish_time desc NULLS last
    limit 20;