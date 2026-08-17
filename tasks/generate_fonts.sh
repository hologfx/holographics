declare -a arr=(
  "https://fonts.googleapis.com/css?family=Abril+Fatface"
  "https://fonts.googleapis.com/css?family=Cabin:400,400i,500,500i,600,600i,700,700i",
  "https://fonts.googleapis.com/css?family=Cardo:400,400i,700",
  "https://fonts.googleapis.com/css?family=Gentium+Basic:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Gentium+Book+Basic:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Gravitas+One:400",
  "https://fonts.googleapis.com/css?family=Inconsolata:400,700",
  "https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i",
  "https://fonts.googleapis.com/css?family=Lobster:400",
  "https://fonts.googleapis.com/css?family=Lobster+Two:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Merriweather+Sans:300,300i,400,400i,700,700i,800,800i",
  "https://fonts.googleapis.com/css?family=Merriweather:300,300i,400,400i,700,700i,900,900i",
  "https://fonts.googleapis.com/css?family=Nunito+Sans:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
  "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
  "https://fonts.googleapis.com/css?family=Old+Standard+TT:400,400i,700",
  "https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i",
  "https://fonts.googleapis.com/css?family=PT+Mono:400",
  "https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Pacifico:400",
  "https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i,900,900i",
  "https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700",
  "https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i",
  "https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i",
  "https://fonts.googleapis.com/css?family=Ubuntu+Condensed:400",
  "https://fonts.googleapis.com/css?family=Ubuntu:300,300i,400,400i,500,500i,700,700i",
  "https://fonts.googleapis.com/css?family=VT323|Vollkorn:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i",
  "https://fonts.googleapis.com/css?family=Work+Sans:100,200,300,400,500,600,700,800,900",
  "https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
)

for i in "${arr[@]}"
do
   npx goofoffline outDir=src/server/public/google_fonts outCss=google_fonts.css "$i"
done

