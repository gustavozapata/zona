exports.renderMain = (req, res) => {
  res.status(200).render("main", {
    title: "Private Social Media",
  });
};
