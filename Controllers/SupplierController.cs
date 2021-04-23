using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;
using System.Threading.Tasks;

namespace QLCT.Controllers
{
    public class SupplierController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // View
        public ActionResult Index(int? page)
        {
            

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewsup = from c in db.Suppliers
                          where c.IsDeleted == false
                          where c.Status == 1
                          orderby c.Name descending
                          select c;
            return View(viewsup.ToPagedList(page ?? 1, 20));
        }
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.lstStaff = from u in db.Users
                               where u.IsDeleted == false
                               select new UserDepart
                               { IdUser = u.Id, 
                                 NameUser = u.Name };
            return View();
        }
        [HttpPost]
        public ActionResult Insert(Supplier sup)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            Supplier checksup = db.Suppliers.Where(s => s.Name == Request["Name"]).FirstOrDefault();
            if (checksup != null)
            {
                ViewBag.check = "Khách hàng này đã tồn tại!";
                return RedirectToAction("Index", "Supplier");
            }
            
            else
            {
                sup.IdStaff = Convert.ToInt32(Request["IdStaff"]);
                sup.Name = Request["Name1"];
                sup.Phone = Request["Phone1"];
                sup.Address = Request["Address"];
                sup.Debt = Decimal.Parse(Request["Debt"]);
                sup.TIN = Request["TIN"];
                sup.TIN = Request["TIN"];
                sup.BankNumber = Request["BankNumber"];
                sup.BankName = Request["BankName"];
                sup.BankAddress = Request["BankAddress"];
                sup.Status = 1;
                sup.IsDeleted = false;
                db.Suppliers.InsertOnSubmit(sup);
                // tang so luong sup quan ly
                var increaseSup = db.Users.Where(c => c.Id == Convert.ToInt32(Request["IdStaff"])).FirstOrDefault();
                increaseSup.NumberSup += 1;
                UpdateModel(increaseSup);
                db.SubmitChanges();

            }
            return this.Insert();
        }
        // Update
        public ActionResult Update(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"].ToString() != "PGD" && Session["PB"].ToString() != "PKD")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var pro = db.Suppliers.First(p => p.Id == id);
            ViewBag.lstStaff = from u in db.Users
                           where u.IsDeleted == false
                           select new { u.Id, u.Name };
            return View(pro);
        }
        [HttpPost]
        public ActionResult Update(int id, Supplier sup)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            sup = db.Suppliers.Where(s => s.Id == id).SingleOrDefault();
            int IdStaff = Convert.ToInt32(sup.IdStaff);
            sup.IdStaff = Convert.ToInt32(Request["IdStaff"]);
            sup.Name = Request["Name"];
            sup.Phone = Request["Phone"];
            sup.Address = Request["Address"];
            sup.Debt = Decimal.Parse(Request["Debt"]);
            sup.TIN = Request["TIN"];
            sup.BankNumber = Request["BankNumber"]; 
            sup.BankName = Request["BankName"];
            sup.BankAddress = Request["BankAddress"];
            UpdateModel(sup);

            if (sup.IdStaff != IdStaff)
            {
                User increaseSupOld = db.Users.Where(c => c.Id == IdStaff).FirstOrDefault();
                increaseSupOld.NumberSup -= 1;
                TryUpdateModel(increaseSupOld); 
                

                User increaseSupNew = db.Users.Where(c => c.Id == Convert.ToInt32(Request["IdStaff"])).FirstOrDefault(); 
                increaseSupNew.NumberSup += 1;
            }
            /// lỗi update ở tăng numbersup và giảm numbersup, tự nhảy lên id của sup
            db.SubmitChanges();
            return this.Update(id);
        }
        // Delete -- Not Update IsDelete
        public ActionResult Delete(int id, Supplier sup)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            sup = db.Suppliers.Where(s => s.Id == id).SingleOrDefault();
            sup.IsDeleted = true;
            db.SubmitChanges();
            return RedirectToAction("Index", "Supplier");
        }
    }
}