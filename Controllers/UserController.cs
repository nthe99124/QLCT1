using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class UserController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: User
        // View
        public ActionResult IndexUser()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            else
            {
                if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
                {

                    return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                }
                ViewBag.list = from u in db.Users
                               join d in db.Departments on u.IdDepartment equals d.Id
                               where u.IsDeleted == false
                               where u.Id != 0
                               where d.IsDeleted == false
                               orderby u.Name descending
                               select new UserDepart
                               {
                                   NameUser = u.Name,
                                   NameDepart = d.Name,
                                   UserName = u.UserName,
                                   Status = u.Status,
                                   IdUser = u.Id
                               };
            }
            return View();

        }
        public JsonResult IndexUser1()
        {
            var list = from u in db.Users
                       join d in db.Departments on u.IdDepartment equals d.Id
                       where u.IsDeleted == false
                       where u.Id != 0
                       where d.IsDeleted == false
                       orderby u.Name descending
                       select new UserDepart
                       {
                           NameUser = u.Name,
                           NameDepart = d.Name,
                           UserName = u.UserName,
                           Status = u.Status,
                           IdUser = u.Id
                       };
            return Json(list, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public ActionResult IndexUser(int Status)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            else
            {
                if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
                {

                    return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
                }
                ViewBag.list = from u in db.Users
                               join d in db.Departments on u.IdDepartment equals d.Id
                               where u.IsDeleted == false
                               where u.Status == Status
                               where u.Id != 0
                               where d.IsDeleted == false
                               orderby u.Name descending
                               select new UserDepart
                               {
                                   NameUser = u.Name,
                                   NameDepart = d.Name,
                                   UserName = u.Name,
                                   Status = u.Status,
                                   IdUser = u.Id
                               };
            }
            return View();
        }
        public ActionResult IndexDivision()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            else
            {
                if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
                {
                    ViewBag.notify = "Bạn không có quyền truy cập";
                }
                ViewBag.list = (from d in db.Departments
                                join u in db.Users on d.IdHeader equals u.Id into u1
                                from u2 in u1.DefaultIfEmpty()
                                where d.IsDeleted == false
                                orderby d.Name descending
                                select new UserDepart
                                {
                                    IdHeader = d.IdHeader,
                                    NameUser = u2.Name,
                                    NameDepart = d.Name,
                                    NumberStaff = d.NumberStaff,
                                    IdUser = u2.Id
                                });
                ViewBag.listLead = (from u in db.Users where u.IdDepartment == 0 select u);
                ViewBag.listLeadUpdate = (from u in db.Users select u);
            }
            return View();

        }
        // InsertUser
        public ActionResult InsertUser()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            ViewBag.IdDepartment = from d in db.Departments
                                   select d;
            return View();
        }
        [HttpPost]
        public ActionResult InsertUser(User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            RemoveUnicode(Request["Name"]).Replace(" ", "");
            //string b = Request["Name"];
            //string[] a = null;
            //for (int i = 0; i < Request["Name"].Length; i++)
            //{

            //    do
            //    {
            //        a[i] += b[i];
            //        i++;
            //    } while (b[i].ToString()!=" ");
            //}
            var checkuser = db.Users.Where(u => u.Phone == Request["Phone"]).FirstOrDefault();
            if (checkuser == null)
            {
                RemoveUnicode(Request["Name"]).Replace(" ", "");
                user.UserName = String.Format("{0}@vuha.com.vn", RemoveUnicode(Request["Name"]).Replace(" ", ""), user.Id);
                user.PassWord = String.Format("VuHa_{0}", RemoveUnicode(Request["Name"]).Replace(" ", ""));
                user.Sex = Convert.ToBoolean(Request["Sex"]);
                user.Phone = Request["Phone"];
                user.IdDepartment = Convert.ToInt32(Request["IdDepartment"]);
                user.Status = Convert.ToInt32(Request["Status"]);
                user.IsDeleted = false;
                user.NumberSup = 0;
                user.NumberCus = 0;
                db.Users.InsertOnSubmit(user);
                // tang sl nhan vien
                var increaseDepart = db.Departments.Where(d => d.Id == Convert.ToInt32(Request["IdDepartment"])).FirstOrDefault();
                increaseDepart.NumberStaff += 1;
                UpdateModel(increaseDepart);
                db.SubmitChanges();
            }
            else
            {
                ViewBag.check = "Nhân sự đã tồn tại";
            }
            return this.InsertUser();
        }
        [HttpPost]
        public JsonResult InsertDivision(string Name, int Header)
        {
            var checkDepart = db.Departments.Where(d => d.Name == Name).FirstOrDefault();
            Department de = new Department();
            if (checkDepart == null)
            {
                de.Name = Name;
                de.IsDeleted = false;
                de.IdHeader = Header;
                de.NumberStaff = 0;
                db.Departments.InsertOnSubmit(de);
                db.SubmitChanges();
            }
            else
            {
                ViewBag.check = "Phòng ban đã tồn tại";
            }
            var messenger = "Sucessfull";
            return Json(messenger);
        }

        // UpdateUser
        public ActionResult UpdateUser(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var user = db.Users.First(u => u.Id == id);
            ViewBag.IdDepartment = from d in db.Departments
                                   select d;
            return View(user);
        }
        [HttpPost]
        public ActionResult UpdateUser(int id, User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            //user = db.Users.Where(u => u.Id == id).SingleOrDefault();
            user.UserName = Request["UserName"];
            user.PassWord = Request["PassWord"];
            user.Name = Request["Name"];
            user.Sex = Convert.ToBoolean(Request["Sex"]);
            user.Phone = Request["Phone"];
            user.IdDepartment = Convert.ToInt32(Request["IdDepartment"]);
            user.Status = Convert.ToInt32(Request["Status"]);
            UpdateModel(user);
            db.SubmitChanges();
            return this.UpdateUser(id);
        }

        // UpdateDevision
        public ActionResult UpdateDevision(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["PB"] != "PGD" && Session["PB"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            var user = db.Users.First(u => u.Id == id);
            return View(user);
        }
        [HttpPost]
        public ActionResult UpdateDevision(int id, User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            user = db.Users.Where(u => u.Id == id).SingleOrDefault();
            user.UserName = Request["UserName"];
            user.PassWord = Request["PassWord"];
            user.Name = Request["Name"];
            user.Sex = Convert.ToBoolean(Request["Sex"]);
            user.Phone = Request["Phone"];
            user.IdDepartment = Convert.ToInt32(Request["IdDepartment"]);
            user.Status = Convert.ToInt32(Request["Status"]);
            UpdateModel(user);
            db.SubmitChanges();
            return this.UpdateDevision(id);
        }

        // Delete -- Update IsDelete
        public ActionResult Delete(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public ActionResult Delete(int id, User user)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            if (Session["user"] != "PGD" && Session["user"] != "PNS")
            {
                return Content("<script language='javascript' type='text/javascript'>alert('Ban khong co quyen truy cap!');</script>");
            }
            user = db.Users.Where(u => u.Id == id).SingleOrDefault();
            user.IsDeleted = true;
            UpdateModel(user);
            db.SubmitChanges();
            return this.Delete(id);
        }
        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }
    }
}