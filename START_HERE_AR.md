# تشغيل ونشر AboEsmail Coaching

هذه النسخة مجهزة لحساب أحمد والريبو التالي:
https://github.com/AboEsmail20/AboEsmail-Coaching

الرابط المتوقع بعد نجاح النشر:
https://aboesmail20.github.io/AboEsmail-Coaching/

## التشغيل على الكمبيوتر

ثبّت Node.js 22 أو أحدث. فك الضغط وافتح مجلد المشروع في VS Code.
افتح Terminal داخل المجلد وشغّل:

```sh
npm ci
npm run dev
```

افتح الرابط الذي يظهر في التيرمنال مع المسار /AboEsmail-Coaching/.
لا تفتح index.html مباشرة.

لإنشاء نسخة الإنتاج:

```sh
npm run build
npm run preview
```

ملفات الكود في src، والصور في public/assets. مجلد dist يتولد عند البناء.

## رفع النسخة على GitHub

1. ارفع محتويات مجلد المشروع إلى جذر الريبو على فرع main، بما فيها مجلد .github.
2. يجب أن يظهر package.json مباشرة في صفحة الريبو، وأن يكون ملف النشر في .github/workflows/deploy.yml.
3. لو الرفع من المتصفح تجاهل المجلد الذي يبدأ بنقطة، اختر Add file ثم Create new file. اكتب المسار .github/workflows/deploy.yml كاملًا والصق محتوى الملف الموجود محليًا ثم احفظه.
4. افتح Settings ثم Pages واختر GitHub Actions في Source.
5. من Actions افتح Deploy AboEsmail to GitHub Pages وانتظر النجاح. إذا سبقت المحاولة تفعيل Pages، أعد تشغيلها بعد التفعيل.
6. افتح الموقع وجرّب تغيير اللغة وفتح تفاصيل كل باقة وتحديث الصفحة والحجز عبر واتساب.

ارفع ملفات المصدر. احتفظ بـ node_modules وdist على جهازك فقط.
وجود الملفات في GitHub وحده لا يكفي؛ يجب أن ينجح تشغيل النشر.

## صورة المشاركة والروابط

صورة المشاركة هي public/assets/social-preview.png.
ينتج البناء وسوم Open Graph وTwitter وصورة برابط مطلق، في الرئيسية وفي صفحات الباقات الأربع.
تتولد عناوين وأوصاف منفصلة للباقات، ويمكن مشاركة روابطها مباشرة:

- https://aboesmail20.github.io/AboEsmail-Coaching/packages/basic/
- https://aboesmail20.github.io/AboEsmail-Coaching/packages/standard/
- https://aboesmail20.github.io/AboEsmail-Coaching/packages/premium/
- https://aboesmail20.github.io/AboEsmail-Coaching/packages/training/

الرابط والصورة يجب أن يكونا متاحين للعامة بعد النشر. قد يحتفظ التطبيق بمعاينة قديمة لبعض الوقت.
بعض التطبيقات أو مواضع النشر، مثل الستوري، قد لا تعرض بطاقة للرابط أصلًا.

## لو اتغير حساب GitHub أو اسم الريبو أو الدومين

أثناء النشر باستخدام ملف GitHub Actions المرفق، تُقرأ وصلة الموقع من إعدادات GitHub Pages تلقائيًا وتُضبط مسارات الصور والراوتر وروابط المشاركة عند البناء.

للتشغيل والبناء المحلي، عنوان الموقع الافتراضي موجود في مكان واحد: site.config.json.
غيّر siteUrl فقط إذا تغير العنوان النهائي. يمكنك أيضًا تمرير متغير SITE_URL لعملية البناء.
إذا انتقلت إلى استضافة أخرى، ضع عنوانها العام في site.config.json ثم أعد البناء وارفع محتويات dist.

## التسليم

تحتوي النسخة على المصدر والصور وملفات التشغيل والقفل وإعداد النشر.
لم يتم تنفيذ نشر جديد على حساب أحمد من خلال تجهيز هذا الملف؛ الرفع وتشغيل Actions هما خطوة النشر الفعلية.
