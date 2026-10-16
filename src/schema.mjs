export const categories = ['auto_renewal','cancellation_fee','refund_limit','data_sharing','content_license','unilateral_change','arbitration','liability_limit'];
export const schema = {
 type:'object',additionalProperties:false,required:['risks','uncertainties'],properties:{
 risks:{type:'array',maxItems:24,items:{type:'object',additionalProperties:false,required:['category','quote','explanation','confidence'],properties:{category:{type:'string',enum:categories},quote:{type:'string',minLength:12,maxLength:700},explanation:{type:'string',minLength:10,maxLength:650},confidence:{type:'number',minimum:0,maximum:1}}}},
 uncertainties:{type:'array',maxItems:10,items:{type:'string',minLength:1,maxLength:300}}
 }};
export const weights={auto_renewal:15,cancellation_fee:20,refund_limit:10,data_sharing:15,content_license:10,unilateral_change:10,arbitration:10,liability_limit:10};
export const labels={auto_renewal:'Otomatik yenileme',cancellation_fee:'İptal ücreti',refund_limit:'İade sınırlaması',data_sharing:'Veri paylaşımı',content_license:'İçerik lisansı',unilateral_change:'Tek taraflı değişiklik',arbitration:'Tahkim / dava hakkı',liability_limit:'Sorumluluk sınırı'};
